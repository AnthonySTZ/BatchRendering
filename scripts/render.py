import sys
import subprocess
import json

data_in = json.loads(sys.argv[1])
kick = data_in["kick"].replace("/", "\\")
path = data_in["path"]

command = "kick -i " + path

subprocess.run(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True, shell=True, cwd=kick)

print("Rendering ! " + path)