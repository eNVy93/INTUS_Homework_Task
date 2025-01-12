
namespace INTUS_Homework_Task.Server.Services
{
    public interface IIOService
    {
        Task<string> ReadFileAsync(string pathToFile);
        Task WriteToFileAsync(string pathToFile, string data);
    }
}