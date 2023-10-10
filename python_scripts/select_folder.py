import sys
import tkinter
from tkinter import filedialog

tkinter.Tk().withdraw() # prevents an empty tkinter window from appearing

filePath = filedialog.askdirectory(initialdir = "/")


print(filePath)
sys.stdout.flush()