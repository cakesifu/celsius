from fabric.api import *
from fabric.colors import *

import json

DEPLOY_PATH = "$HOME/celsius"
REPO_URL = "git@github.com:cezar-berea/celsius.git"

env.roledefs = {
    "webserver": ["deploy@localhost"]
}

env.colorize_errors = True
env.linewise = True

@task
def staging():
    """ Prefix task. Uses stanging environment """
    env.roledefs["webserver"] = ["deploy@localhost"]
    env.deploy_path = DEPLOY_PATH

@task
def production():
    """ Prefix task. Uses production environment """
    env.roledefs["webserver"] = ["production@localhost"]

@task
@roles("webserver")
def deploy():
    crt_deployment = _read_deploy_info()

    if crt_deployment is None:
        cold_deploy()

    print crt_deployment



def _read_deploy_info():
    with settings(warn_only=True): # TODO if possible disable warnings at all
        run("echo $HOME/celsius")
        deploy_file = deploy_path("deploy.json")

        if run("test -f {}".format(deploy_file)).failed:
            return None

        raw_info = run("cat {}".format(deploy_file))

        if raw_info.failed or not raw_info:
            return None

        return json.loads(raw_info)


def _create_deploy_info():
    commit = ""
    date = "now"

    with cd(deploy_path()):
        commit = run("git rev-parse HEAD")

    return {
        "commit": commit,
        "deployed_at": date
    }


def cold_deploy():
    run("rm -Rf {}".format(deploy_path()))
    run("git clone -q {} {}".format(REPO_URL, env.deploy_path))
    info = _create_deploy_info()
    info_str = json.dumps(info)
    run("echo '{}' > {}".format(info_str, deploy_path("deploy.json")))


def  deploy_path(path=""):
    return "{}/{}".format(env.deploy_path, path)
