import sys
import tkinter
from tkinter import filedialog

data_in = sys.argv[1] #Get data from javascript
# data_in = data_in.replace("|", "\n")
# data_in = data_in.replace("[", "\n  [\n     ")
# data_in = data_in.replace(",", ",\n     ")
# data_in = data_in.replace("]", "  ]\n")



tkinter.Tk().withdraw() # prevents an empty tkinter window from appearing

filePath = filedialog.asksaveasfilename(initialfile = '.br', defaultextension=".br",filetypes=[("Batch Rendering","*.br")])

if filePath:

    fob = open(filePath,'w')
    fob.write(data_in)
    fob.close()

print(filePath)
sys.stdout.flush()