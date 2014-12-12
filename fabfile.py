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
    env.roledefs = hosts["staging"]["servers"]
    env.deploy_path = DEPLOY_PATH

@task
def production():
    """ Prefix task. Uses production environment """
    env.roledefs = hosts["production"]["servers"]
    env.deploy_path = DEPLOY_PATH

@task
@roles("webserver")
def deploy(branch="origin/master"):
    crt_deployment = read_deploy_info()

    if crt_deployment is None:
        cold_deploy()

    sudo("systemctl stop celsius_app.service")

    with cd(deploy_path()):
        run("git fetch -q origin")
        run("git checkout -qf {}".format(branch))
        run("make dist")

    sudo("systemctl start celsius_app.service")

    write_deploy_info()


def read_deploy_info():
    with settings(warn_only=True): # TODO if possible disable warnings at all
        run("echo $HOME/celsius")
        deploy_file = deploy_path("deploy.json")

        if run("test -f {}".format(deploy_file)).failed:
            return None

        raw_info = run("cat {}".format(deploy_file))

        if raw_info.failed or not raw_info:
            return None

        return json.loads(raw_info)


def write_deploy_info():
    commit = ""
    date = "now"

    with cd(deploy_path()):
        commit = run("git rev-parse HEAD")

    info = {
        "commit": commit,
        "deployed_at": date
    }
    info_str = json.dumps(info)
    run("echo '{}' > {}".format(info_str, deploy_path("deploy.json")))


def cold_deploy():
    run("rm -Rf {}".format(deploy_path()))
    run("git clone -q {} {}".format(REPO_URL, deploy_path()))


def  deploy_path(path=""):
    return "{}/{}".format(env.deploy_path, path)
