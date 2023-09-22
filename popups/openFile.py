import sys
import tkinter
from tkinter import filedialog

tkinter.Tk().withdraw() # prevents an empty tkinter window from appearing

filePath = filedialog.askopenfilename(initialdir = "/", initialfile = '.br', defaultextension=".br", filetypes=[("Batch Rendering","*.br")])

print(filePath)
sys.stdout.flush()