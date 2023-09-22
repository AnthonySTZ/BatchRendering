import sys
import tkinter
from tkinter import filedialog

tkinter.Tk().withdraw() # prevents an empty tkinter window from appearing

file = filedialog.askopenfile(initialdir = "/", initialfile = '.br', defaultextension=".br", filetypes=[("Batch Rendering","*.br")])

print(file)
sys.stdout.flush()