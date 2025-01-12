using INTUS_Homework_Task.Server.Entities;
using INTUS_Homework_Task.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace INTUS_Homework_Task.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShapesController : ControllerBase
    {
        private readonly ILogger<ShapesController> _logger;
        private readonly IShapeService _shapeService;

        public ShapesController(ILogger<ShapesController> logger, IShapeService shapeService)
        {
            _logger = logger;
            _shapeService = shapeService;
        }

        [HttpGet(Name = "Get")]
        public async Task<Result<string>> Get()
        {
            var data = await _shapeService.GetDataFromFileAsync();
            return data;
         
        }
        [HttpPost(Name = "Save")]
        public async Task<Result<string>> Save(Rectangle rectangle, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var data = await _shapeService.ConvertShapeToString(rectangle);
            var validationResult = await _shapeService.ValidateData(data, cancellationToken);

            if (!validationResult.Success)
                return validationResult;

            return await _shapeService.SaveDataToFileAsync(data: data);
        }
    }
}
