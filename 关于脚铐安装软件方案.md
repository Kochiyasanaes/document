## About the software solution for installing foot cuffs
---
*About the software solution for installing foot cuffs*

## Requirement environment
* Windows
* ADB tool required（Download link:https://github.com/Kochiyasanaes/document/raw/main/platform-tools_r33.0.2-windows.zip

---
## Installation steps
* Open the software package folder and hold down the Win+R key to enter cmd
* Enter the cd command to switch to the file directory
* Input instructions
  *   adb root
  *   adb remount
  *   adb push Software name.apk system/app
  *   adb shell am start com.xrs.bluetooth_device/.MainActivity 
 
 ![image](https://github.com/Kochiyasanaes/document/raw/main/2.png)

![image](https://github.com/Kochiyasanaes/document/raw/main/1.png)

![image](https://github.com/Kochiyasanaes/document/raw/main/4.png)
