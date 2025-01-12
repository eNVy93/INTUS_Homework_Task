using Newtonsoft.Json;
using System.IO;

namespace INTUS_Homework_Task.Server.Services
{
    public static class JsonHelper
    {
        public static async Task<string> ReadFileAsync(string pathToFile)
        {
            StreamReader sr = new(pathToFile);
            var result = await sr.ReadToEndAsync();
            sr.Close();
            sr.Dispose();
            return result;
        }
        public static async Task WriteToFileAsync(string pathToFile, string data)
        {
            StreamWriter sw = new(pathToFile);
            await sw.WriteAsync(data);
            sw.Close();
            await sw.DisposeAsync();
        }

        public static string Serialize<T>(T data)
        {
            return JsonConvert.SerializeObject(data);
        }

        public static T Deserialize<T>(string data)
        {
            var result = JsonConvert.DeserializeObject<T>(data);

            return result;
        }

    }
}
