import sys
import subprocess
import json
from pathlib import Path

def getFrameRange(objects):
    for element in objects:
        if element["type"] == "options":
            frameStart = element["frameStart"]
            frameEnd = element["frameEnd"]
            return (frameStart, frameEnd)


def getPolymeshes(objects):
    polymeshes = ""
    for element in objects:
        if element["type"] == "polymesh":
            if element["visibility"] == 1: #Hidden
                polymeshes = ""
                for path in element["path"]:
                    polymeshes += " -set /" + path + ".visibility 0"
                continue
            if element["visibility"] == 2: #Matte
                polymeshes = ""
                for path in element["path"]:
                    polymeshes += " -set /" + path + ".matte true"
                continue
            if element["visibility"] == 3: #Holdout
                polymeshes = ""
                for path in element["path"]:
                    polymeshes += " -set /" + path + ".visibility 254"
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
            samples =  " -set options.AA_samples " + str(element["camera"])
            samples += " -set options.GI_diffuse_samples " + str(element["diffuse"])
            samples += " -set options.GI_specular_samples " + str(element["specular"])
            samples += " -set options.GI_transmission_samples " + str(element["transmission"])
            samples += " -set options.GI_sss_samples " + str(element["sss"])
            samples += " -set options.GI_volume_samples " + str(element["volume"])
            return samples
        
def getRenderDepth(objects):
    for element in objects:
        if element["type"] == "renderDepth":
            depth =  " -set options.GI_total_depth " + str(element["total"])
            depth += " -set options.GI_diffuse_depth " + str(element["diffuse"])
            depth += " -set options.GI_specular_depth " + str(element["specular"])
            depth += " -set options.GI_transmission_depth " + str(element["transmission"])
            depth += " -set options.GI_volume_depth " + str(element["volume"])
            return depth

def getResolution(objects):
    for element in objects:
        if element["type"] == "resolution":
            resolution = " -r " + str(element["x"]) + " " + str(element["y"])
            return resolution

def getFileOutputFile(path, planName, filePath, passeName, name):
    if len(filePath)>0: #If custom output path 
        folderPath = filePath + "/" + planName[:-4] + "/" + passeName
        Path(folderPath).mkdir(parents=True, exist_ok=True) #Create folder if not exist
    else :
        folderPath = path[0 : path.rfind("/")+1] + planName[:-4] + "/" + passeName
        Path(folderPath).mkdir(parents=True, exist_ok=True) #Create folder if not exist

    return " -o " + folderPath +  "/" + name + ".####.exr"



data_in = json.loads(sys.argv[1])
kick = data_in["kick"].replace("/", "\\")
path = data_in["path"]
settings = data_in["settings"]
planName = data_in["planName"][path.rfind("/")+1 : ]



# frameStart, frameEnd = getFrameRange(settings)
frame = data_in["frame"]
fileOutputPath = data_in["fileOutputPath"]
fileOutputName =  data_in["fileOutputName"]
fileOutput = getFileOutputFile(path, planName, fileOutputPath, fileOutputName, fileOutputName)
fileFormat = ' -of exr'
polymeshes = getPolymeshes(settings)
activeCamera = getActiveCamera(settings)
renderSamples = getRenderSamples(settings)
renderDepth = getRenderDepth(settings)
resolution = getResolution(settings)



# fileOutput = " "

fileOutputFrame = fileOutput.replace("####", str(frame).zfill(4))
frameRange = " -set options.frame " + str(frame)
command = "kick -i " + path + " -dw" + fileOutputFrame + activeCamera + resolution + polymeshes + renderSamples + renderDepth + fileFormat + frameRange
subprocess.run(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, shell=True, cwd=kick)

print("finish")


# INT           GI_diffuse_depth                  0
# INT           GI_specular_depth                 0
# INT           GI_transmission_depth             2
# INT           GI_volume_depth                   0
# INT           GI_total_depth                    10
# INT           GI_diffuse_samples                2
# INT           GI_specular_samples               2
# INT           GI_transmission_samples           2
# INT           GI_sss_samples                    2
# INT           GI_volume_samples