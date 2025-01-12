using INTUS_Homework_Task.Server.Entities;

namespace INTUS_Homework_Task.Server.Services
{
    public interface IShapeService
    {
        Task<IShape> ConvertDataToShape(string data);
        Task<string> ConvertShapeToString(IShape data);
        Task<Result<string>> GetDataFromFileAsync(string? pathToFile = null);
        Task<Result<string>> SaveDataToFileAsync(string data, string? pathToFile = null);
        Task<Result<string>> ValidateData(string data, CancellationToken token);
    }
}