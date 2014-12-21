from fabric.api import *
from fabric.utils import *
from fabric.colors import *

import json
import os
import datetime

DEPLOY_PATH = "$HOME/celsius"
REPO_URL = "https://github.com/cezar-berea/celsius.git"

env.roledefs = {
    "webserver": []
}

with open("deploy/hosts.json") as hosts_file:
    hosts = json.load(hosts_file)

env.colorize_errors = True
env.linewise = True

@task
def staging():
    """ Prefix task. Uses stanging environment """
    populate_env(hosts["staging"])

@task
def production():
    """ Prefix task. Uses production environment """
    populate_env(hosts["production"])

@task
@roles("webserver")
def deploy(branch="origin/master"):
    deploy_info = read_deploy_info()

    if deploy_info is None:
        setup_deploy_dir()
        deploy_info = {}

    perform_deploy(branch=branch, deploy_info=deploy_info)

@task
@roles("webserver")
def cold_deploy(branch="origin/master"):
    setup_deploy_dir()
    perform_deploy(branch=branch, deploy_info={})


@task
@roles("webserver")
def rollback(deploy_no=None):
    """Roll back to previous deploy"""
    pass


@task
@roles("webserver")
def cleanup(count=5):
    """Cleanup old depoys. Use param count to specify how many to keep"""
    count = int(count)
    deploy_info = read_deploy_info()
    if deploy_info is None:
        abort("No deploys")

    crt_no = get_current_deploy_no(deploy_info)
    deploys = deploy_info.keys()
    deploys.sort()
    puts("Current deploy count: {}".format(len(deploys)))
    puts("Keep only {} deploys".format(count))
    if len(deploys) <= count:
        abort("No deploys to cleanup")

    deploys_to_remove = deploys[:-count]
    if crt_no in deploys_to_remove:
        abort("Current deploy is in the list of deploys to remove")

    for no in deploys_to_remove:
        run("rm -rf {}".format(deploy_info[no]["fullpath"]), warn_only=True)
        del deploy_info[no]

    update_deploy_info(deploy_info)

@task
@roles("webserver")
def current_deploy():
    pass

@task
@roles("webserver")
def list_deploys():
    deploy_info = read_deploy_info()
    if not deploy_info:
        print "No deploys"
        return

    crt_no = get_current_deploy_no(deploy_info)
    keys = deploy_info.keys()
    keys.sort()
    for no in keys:
        info = deploy_info[no]
        extra = "(current)" if no == crt_no else ""
        puts("deploy no: {} {}".format(no, extra))
        puts(indent("commit: {}".format(info["commit"]), spaces=2))
        puts(indent("folder: {}".format(info["folder"]), spaces=2))
        puts(indent("fullpath: {}".format(info["fullpath"]), spaces=2))


def perform_deploy(branch, deploy_info):
    commit = local("git rev-parse {}".format(branch), capture=True)

    local_archive_file = create_archive(commit)
    remote_archive_file = upload_archive(local_archive_file)
    deploy_no = next_deploy_no(deploy_info)
    folder_name = next_deploy_folder(deploy_no)
    deploy_folder = deploy_path(folder_name)
    current_folder = deploy_path("current")

    run("rm -rf {}".format(deploy_folder))
    run("mkdir -p {}".format(deploy_folder))
    run("tar -xzf {} -C {}".format(remote_archive_file, deploy_folder))

    sudo("systemctl stop celsius_app.service")
    run("unlink {}".format(current_folder), warn_only=True)
    run("ln -s {} {}".format(deploy_folder, current_folder))
    sudo("systemctl start celsius_app.service")

    append_deploy_info(info=deploy_info,
                       commit=commit,
                       deploy_no=deploy_no,
                       folder=folder_name,
                       fullpath=deploy_folder)


def setup_deploy_dir():
    run("rm -rf {}".format(deploy_path("*")))
    run("rm -rf {}/*".format(env.remote_temp_path))
    run("mkdir -p {}".format(deploy_path()))
    run("mkdir -p {}".format(env.remote_temp_path))


def next_deploy_no(info):
    keys = [int(k) for k in info.keys()]
    deploy_no = max(keys) + 1 if len(keys) else 1
    return deploy_no

def next_deploy_folder(deploy_no):
    return "deployment-{}".format(deploy_no)

def populate_env(config):
    env.roledefs = config["servers"]
    env.remote_deploy_path = config.get("remoteDeployPath")
    env.remote_temp_path = config.get("remoteTempPath")
    env.local_temp_path = config.get("localTempPath")

def read_deploy_info():
    with settings(warn_only=True): # TODO if possible disable warnings at all
        deploy_file = deploy_path("deploy.json")

        if run("test -f {}".format(deploy_file)).failed:
            return None

        raw_info = run("cat {}".format(deploy_file))

        if raw_info.failed or not raw_info:
            return None

        return json.loads(raw_info)

def append_deploy_info(info, deploy_no, commit, folder, fullpath):
    info[int(deploy_no)] = {
        "commit": commit,
        "folder": folder,
        "fullpath": fullpath,
        "deploy_no": int(deploy_no),
        "date": datetime.utcnow().isoformat()
    }
    update_deploy_info(info)

def update_deploy_info(info):
    deploy_file = deploy_path("deploy.json")
    info_str = json.dumps(info)
    run("echo '{}' > {}".format(info_str, deploy_file))


def create_archive(commit):
    local_archive_file = "{}/celsius-{}.tar.gz".format(env.local_temp_path, commit)
    local_dir = "{}/celsius-{}".format(env.local_temp_path, commit)
    local("mkdir -p {}".format(local_dir))
    local("git archive {} | tar -xC {}".format(commit, local_dir))
    with cd(local_dir):
        #local("make dist")
        local("tar -czf {} -C {} .".format(local_archive_file, local_dir))

    return local_archive_file


def upload_archive(local_archive_file):
    fname = os.path.basename(local_archive_file)
    remote_archive_file = "{}/{}".format(env.remote_temp_path, fname)

    run("mkdir -p {}".format(env.remote_temp_path))
    put(local_archive_file, remote_archive_file)

    return remote_archive_file

def get_current_deploy_no(deploy_info):
    crt_dir = deploy_path("current")
    if run("test -d {}".format(crt_dir), warn_only=True).failed:
        return None

    crt_path = run("readlink -ef {}".format(crt_dir))
    for no in deploy_info.keys():
        if deploy_info[no]["fullpath"] == crt_path:
            return no

def clean():
    pass

def  deploy_path(path=""):
    return "{}/{}".format(env.remote_deploy_path, path)

