namespace RentAPlace.API.Models;

public class User
{
    public int Id { get; set; }

    public string FullName { get; set; } = "";

    public string Email { get; set; } = "";

    public string PasswordHash { get; set; } = "";

    public string Role { get; set; } = "Renter";

    public ICollection<Property> OwnedProperties { get; set; } = new List<Property>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    public ICollection<Review> GivenReviews { get; set; } = new List<Review>();
}
