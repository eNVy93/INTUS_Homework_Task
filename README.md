# This is a solution for INTUS Windows homework task.

To run the solution run this command ```dotnet run --launch-profile https``` inside **_./INTUS_Homework_Task.Server_**.
The file that program reads from is located inside **_./INTUS_Homework_Task.Server_**. Named _RectangleDimensions.json_.
Frontend solution runs on port 7273 (https://localhost:7273/)

The project boilerplate was created by selecting React App on Visual Studio.
### How to use
* On the frontend you'll see a rectangle that represends a window. You should be able to drag the shape using any corner.
* There is a border (canvas) that the window shape cannot exceeed. If you go out of bounds - the shape resets to its initial form.
* When you drag and release - data validation begins. It should take 10 seconds to validate.
* You can resize the shape during validation. By doing so you'll cancel the previous validation and start a new one.
* Perimeter and validation result can be seen below the canvas.
