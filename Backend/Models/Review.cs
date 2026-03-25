namespace RentAPlace.API.Models;

public class Review
{
    public int Id { get; set; }
    
    public int PropertyId { get; set; }
    public int ReviewerId { get; set; }
    
    public int Rating { get; set; }
    public string Comment { get; set; } = "";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Property? Property { get; set; }
    public User? Reviewer { get; set; }
}
