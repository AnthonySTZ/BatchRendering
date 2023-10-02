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
            if element["visibility"] == 3: #Holdout
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

data_in = json.loads(sys.argv[1])
kick = data_in["kick"].replace("/", "\\")
path = data_in["path"]
settings = data_in["settings"]
polymeshes = getPolymeshes(settings, path)
activeCamera = getActiveCamera(settings)
renderSamples = getRenderSamples(settings)
resolution = getResolution(settings)


command = "kick -i " + path + activeCamera + resolution + polymeshes + renderSamples

print("Rendering ! " + command)

subprocess.run(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, shell=True, cwd=kick)



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