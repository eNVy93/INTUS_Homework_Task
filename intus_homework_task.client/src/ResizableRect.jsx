import { useState, useRef, useEffect } from 'react';

function ResizableRectangle(props) {
      const [originalRectangle] = useState(props.rectangle);
      const [rectangle, setRectangle] = useState(props.rectangle);
      const [rectangleCorners, setRectangleCorners] = useState();
      const [cursorStyle, setCursorStyle] = useState("default");
      const [isResizing, setIsResizing] = useState(false);
      const [activeCorner, setActiveCorner] = useState(null);
      const [validationResponse, setValidationResponse] = useState();
      const [isValidating, setIsValidating] = useState();
    
      const svgRef = useRef(null);
      
    
      useEffect(() => {
        props.getRectangle();
      }, []);
    
      useEffect(() => {
        getRectangleCornerCoordinates();
        if(rectangle != originalRectangle){
            setIsValidating(true);
        }
      }, [rectangle]);
    
      useEffect(() => {
        document.body.style.cursor = cursorStyle;
      }, [cursorStyle]);

      useEffect(() =>{
        if(isValidating){
            setIsValidating(false);
        }
      }, [validationResponse])

      return (
        <div>
          {rectangle ? (
            <svg
              ref={svgRef}
              width="800"
              height="600"
              style={{ border: "2px solid black", backgroundColor: '#1a1a1a' }}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseleave}
              onMouseDown={onMouseDown}
            >
              <rect
                x={rectangle.StartPointX}
                y={rectangle.StartPointY}
                width={rectangle.Width}
                height={rectangle.Height}
                fill="#84cdee"
                stroke="#582f0e"
                strokeWidth="5"
              />
            </svg>
          ) : (
            "LOADING..."
          )}
          <div>
            {rectangle
              ? `Perimeter: ${Math.round(2 * (rectangle.Height + rectangle.Width))}`
              : "Perimeter:"}
          </div>
          <div>{displayValidationResult()}</div>
        </div>
      );

 
      function onMouseDown(e) {
        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        for (const corner in rectangleCorners) {
          if (isNearCorner(mouseX, mouseY, rectangleCorners[corner])) {
            setActiveCorner(corner);
            setIsResizing(true);
            return;
          }
        }
      }
    
      function onMouseMove(e) {
        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        findCorner(mouseX, mouseY);
        if (!isResizing || !activeCorner) return;
        return resizeRectangle(mouseX, mouseY);
      }

      function onMouseleave(e){
        if(isResizing && activeCorner){
            setIsResizing(false);
            setActiveCorner(null);
            setRectangle(originalRectangle);
            setIsValidating(true);
        }
      }
    
      async function onMouseUp(e) {
        setIsResizing(false);
        setActiveCorner(null);
        await validateOnSave();
      }

      function getRectangleCornerCoordinates() {
        if (rectangle) {
          var rectangleCorners = {
            A: { X: rectangle.StartPointX, Y: rectangle.StartPointY },
            B: {
              X: rectangle.StartPointX,
              Y: rectangle.StartPointY + rectangle.Height,
            },
            C: {
              X: rectangle.StartPointX + rectangle.Width,
              Y: rectangle.StartPointY + rectangle.Height,
            },
            D: {
              X: rectangle.StartPointX + rectangle.Width,
              Y: rectangle.StartPointY,
            },
          };
    
          setRectangleCorners(rectangleCorners);
        }
      }
    
      function isNearCorner(mouseX, mouseY, corner) {
        const tolerance = 5;
        return (
          Math.abs(mouseX - corner.X) <= tolerance &&
          Math.abs(mouseY - corner.Y) <= tolerance
        );
      }
    
      function findCorner(mouseX, mouseY) {
        const cornerStyles = {
          A: "se-resize",
          B: "ne-resize",
          C: "se-resize",
          D: "ne-resize",
        };
    
        let style = "default";
        for (const corner in rectangleCorners) {
          const cornerCoords = rectangleCorners[corner];
    
          if (isNearCorner(mouseX, mouseY, cornerCoords)) {
            style = cornerStyles[corner] || "default";
            break;
          }
        }
    
        setCursorStyle(style);
      }
    

      function resizeRectangle(mouseX, mouseY){
        setRectangle((prev) => {
            const newRect = { ...prev };
      
            switch (activeCorner) {
              case "A":
                newRect.StartPointX = mouseX;
                newRect.StartPointY = mouseY;
                newRect.Width = prev.Width + (prev.StartPointX - mouseX);
                newRect.Height = prev.Height + (prev.StartPointY - mouseY);
                break;
              case "B":
                newRect.StartPointX = mouseX;
                newRect.Width = prev.Width + (prev.StartPointX - mouseX);
                newRect.Height = mouseY - prev.StartPointY;
                break;
              case "C":
                newRect.Width = mouseX - prev.StartPointX;
                newRect.Height = mouseY - prev.StartPointY;
                break;
              case "D":
                newRect.Width = mouseX - prev.StartPointX;
                newRect.StartPointY = mouseY;
                newRect.Height = prev.Height + (prev.StartPointY - mouseY);
                break;
              default:
                break;
            }

            return validateRectangle(newRect);
        });
      }

      function validateRectangle(newRect){
        return newRect.Width >= 0 && newRect.Height >= 0 ? newRect : originalRectangle;
      }

      async function validateOnSave(){
        if (rectangle) {
            try {
                const response = await props.saveRectangle(rectangle);
                setValidationResponse(response);
            } catch (error) {
                setValidationResponse({
                    success: false,
                    message: "Validation failed due to an error.",
                });
                console.log('Validation error ', error)
            }

        }
      }

      function displayValidationResult() {
        if (isValidating) {
            return "Validating...";
        }
        if (validationResponse) {
            return (validationResponse.success
                ? <div style={{color: "green"}}>{"Validation successful!"}</div>
                : <div style={{color: "red"}}>{`Validation failed: ${validationResponse.message}`}</div>);
        }
        return null;
    };
    
};

export default ResizableRectangle;
