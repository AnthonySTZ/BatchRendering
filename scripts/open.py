import sys
import tkinter
from tkinter import filedialog

tkinter.Tk().withdraw() # prevents an empty tkinter window from appearing

file = filedialog.askopenfilename(initialdir = "/", initialfile = '.br', defaultextension=".br", filetypes=[("Batch Rendering","*.br")])

f = open(file, "r")
fileContent = f.read()

print(fileContent)
sys.stdout.flush()