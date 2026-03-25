namespace RentAPlace.API.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public int ReviewerId { get; set; }
    public string ReviewerName { get; set; } = "";
    public int Rating { get; set; }
    public string Comment { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class ReviewCreateDto
{
    public int PropertyId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = "";
}
