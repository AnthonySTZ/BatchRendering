import sys
import subprocess
import json

def getPolymeshes(objects):
    for element in objects:
        if element["type"] == "polymesh":
            return element

def getActiveCamera(objects):
    for element in objects:
        if "selected" in element:
            if element["selected"] == 1:
                camera = "/" + element["name"]
                return camera

def getRenderSettings(objects):
    for element in objects:
        if element["type"] == "renderSettings":
            return element

data_in = json.loads(sys.argv[1])
kick = data_in["kick"].replace("/", "\\")
path = data_in["path"]
settings = data_in["settings"]
polymeshes = getPolymeshes(settings)
cameraName = getActiveCamera(settings)
renderSettings = getRenderSettings(settings)



command = "kick -i " + path + " -c " + cameraName + " -è"

subprocess.run(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, shell=True, cwd=kick)

print("Rendering ! " + path)