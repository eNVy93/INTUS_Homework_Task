namespace INTUS_Homework_Task.Server.Services
{
    public class IOService : IIOService
    {
        public async Task<string> ReadFileAsync(string pathToFile)
        {
            using var sr = new StreamReader(pathToFile);
            return await sr.ReadToEndAsync();
        }

        public async Task WriteToFileAsync(string pathToFile, string data)
        {
            using var sw = new StreamWriter(pathToFile);
            await sw.WriteAsync(data);
        }
    }
}
