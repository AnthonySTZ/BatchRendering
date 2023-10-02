import sys
import subprocess
import json

def getPolymeshes(objects, path):
    polymeshes = ""
    for element in objects:
        if element["type"] == "polymesh":
            if element["visibility"] == 1: #Hidden
                polymeshes += " -set /" + element["path"] + ".visibility 0"
                continue
            if element["visibility"] == 2: #Matte
                polymeshes += " -set /" + element["path"] + ".matte true"
                continue
            if element["visibility"] == 3: #Phantom
                polymeshes += " -set /" + element["path"] + ".visibility 254"
                continue
    return polymeshes

def getActiveCamera(objects):
    for element in objects:
        if element["type"] == "camera":
            if element["selected"] == 1:
                camera = " -c /" + element["name"]
                return camera
        

def getRenderSamples(objects):
    for element in objects:
        if element["type"] == "renderSamples":
            return element
        
def getRenderDepth(objects):
    for element in objects:
        if element["type"] == "renderDepth":
            return element

def getResolution(objects):
    for element in objects:
        if element["type"] == "resolution":
            resolution = " -r " + str(element["x"]) + " " + str(element["y"])
            return resolution

data_in = json.loads(sys.argv[1])
kick = data_in["kick"].replace("/", "\\")
path = data_in["path"]
settings = data_in["settings"]
polymeshes = getPolymeshes(settings, path)
activeCamera = getActiveCamera(settings)
renderSamples = getRenderSamples(settings)
resolution = getResolution(settings)


command = "kick -i " + path + activeCamera + resolution + polymeshes

print("Rendering ! " + command)

subprocess.run(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, shell=True, cwd=kick)

