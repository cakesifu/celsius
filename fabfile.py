from fabric.api import *
from fabric.colors import *

import json

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

    # make tar of target commit files in $LOCAL_TMP_PATH
    # upload tar to server to $REMOTE_TMP_PATH
    # unpack in new dir under $DEPLOY_PATH
    # build project
    # stop service
    # move link to new folder
    # start service

    if deploy_info is None:
        cold_deploy()
        deploy_info = {}

    commit = local("git rev-parse {}".format(branch), capture=True)

    archive_file = upload_archive(commit)
    deploy_no = next_deploy_no(deploy_info)
    folder_name = next_deploy_folder(deploy_no)
    deploy_folder = deploy_path(folder_name)

    run("mkdir -p {}".format(deploy_folder))
    with cd(deploy_folder):
        run("tar -xzf {}".format(archive_file))
        #run("make dist")

    #sudo("systemctl stop celsius_app.service")

    #with cd(deploy_path()):
    #    run("git fetch -q origin")
    #    run("git checkout -qf {}".format(branch))
    #    run("make dist")

    #sudo("systemctl start celsius_app.service")

    update_deploy_info(info=deploy_info,
                       commit=commit,
                       deploy_no=deploy_no,
                       folder=folder_name,
                       fullpath=deploy_folder)

def update_deploy_info(info, deploy_no, commit, folder, fullpath):
    info[deploy_no] = {
        "commit": commit,
        "folder": folder,
        "fullpath": fullpath
    }
    deploy_file = deploy_path("deploy.json")
    info_str = json.dumps(info)
    run("echo '{}' > {}".format(info_str, deploy_file))

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

def upload_archive(commit):
    local_archive_file = "{}/celsius-{}.tar.gz".format(env.local_temp_path, commit)
    remote_archive_file = "{}/.tmp/{}.tar.gz".format(env.remote_deploy_path, commit)

    local("mkdir -p {}".format(env.local_temp_path))
    local("git archive {} | gzip > {}".format(commit, local_archive_file))
    run("mkdir -p {}".format(env.remote_temp_path))
    put(local_archive_file, remote_archive_file)

    return remote_archive_file

def cold_deploy():
    run("mkdir -p {}".format(deploy_path()))
    run("mkdir -p {}".format(env.remote_temp_path))

def clean():
    pass

def  deploy_path(path=""):
    return "{}/{}".format(env.remote_deploy_path, path)
