namespace INTUS_Homework_Task.Server.Entities
{
    public class Rectangle(decimal? startPointX, decimal? startPointY, decimal? width, decimal? height) : IShape
    {

        public decimal? StartPointX { get; set; } = startPointX;
        public decimal? StartPointY { get; set; } = startPointY;
        public decimal? Width { get; set; } = width;
        public decimal? Height { get; set; } = height;
        public decimal? Perimeter => CalculatePerimeter();

        public decimal? CalculatePerimeter()
        {
            return 2 * (Width + Height);
        }
    }
}
