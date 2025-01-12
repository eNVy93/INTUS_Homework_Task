using INTUS_Homework_Task.Server.Entities;
using System.Reflection.Metadata.Ecma335;

namespace INTUS_Homework_Task.Server.Services
{
    public class RectangleService : IShapeService
    {

        private readonly IIOService _ioService;
        private readonly string _defaultPathToFile;

        public RectangleService(IIOService ioService)
        {
            _ioService = ioService;
            _defaultPathToFile = Path.Combine(AppContext.BaseDirectory, "RectangleDimensions.json");
        }

        public async Task<Result<string>> GetDataFromFileAsync(string? pathToFile = null)
        {
            string path = pathToFile ?? _defaultPathToFile;

            try
            {
                if (!File.Exists(path))
                {
                    return new Result<string>(success: false, message: "File doesn't exist. Wrong path");
                }

                var fileData = await _ioService.ReadFileAsync(path);
                return new Result<string>(success: true, message: "Success", data: fileData);

            }
            catch (Exception)
            {
                return new Result<string>(success: false, message: "An unexpected error occured");
            }
        }

        public async Task<Result<string>> SaveDataToFileAsync(string data, string? pathToFile = null)
        {
            string path = pathToFile ?? _defaultPathToFile;

            if (data == null)
                return new Result<string>(success: false, message: "No data received.");

            try
            {
                await _ioService.WriteToFileAsync(path, data);
            }
            catch (Exception)
            {
                return new Result<string>(success: false, message: "An unexpected error occured");
            }

            return new Result<string>(success: true, message: "Shape saved to file.");
        }

        public Task<IShape> ConvertDataToShape(string data) => Task.Run(() => (IShape)JsonHelper.Deserialize<Rectangle>(data));
        public Task<string> ConvertShapeToString(IShape data) => Task.Run(() => JsonHelper.Serialize<IShape>(data));

        public async Task<Result<string>> ValidateData(string data, CancellationToken token)
        {
            try
            {
                if(string.IsNullOrEmpty(data)) 
                    return new Result<string>(success: false, message: "No data");
                if (await ConvertDataToShape(data) is not Rectangle rect)
                    return new Result<string>(success: false, message: "Couldnt create a rectange from data");

                await Task.Delay(10000, token);
                if(rect.Width > rect.Height)
                {
                    return new Result<string>(success: false, message: "Rectangle width cannot be bigger than height!");
                }
                return new Result<string>(success: true, message: "Rectangle is valid");
            }
            catch (Exception)
            {
                return new Result<string>(success: false, message: "An unexpected error occured");
            }
        }
        
    }
}
