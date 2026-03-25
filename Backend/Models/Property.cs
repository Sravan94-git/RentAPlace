namespace RentAPlace.API.Models;

public class Property
{
    public int Id { get; set; }

    public string Title { get; set; } = "";

    public string Location { get; set; } = "";

    public string PropertyType { get; set; } = "Apartment";

    public decimal Price { get; set; }

    public bool HasPool { get; set; }
    public bool IsBeachFacing { get; set; }
    public bool HasGarden { get; set; }
    public int MaxGuests { get; set; } = 2;
    public decimal Rating { get; set; } = 4.5m;
    public int ReviewsCount { get; set; } = 0;

    public string Description { get; set; } = "";

    public string ImageUrl { get; set; } = "";

    public int OwnerId { get; set; }

    public User? Owner { get; set; }
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
