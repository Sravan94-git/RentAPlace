namespace RentAPlace.API.DTOs;

public class OwnerDashboardMetricsDto
{
    public int TotalProperties { get; set; }
    public int TotalBookings { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageRating { get; set; }
    public List<BookingAlertDto> RecentBookings { get; set; } = new();
}

public class BookingAlertDto
{
    public int BookingId { get; set; }
    public string PropertyTitle { get; set; } = "";
    public string RenterName { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public decimal TotalPrice { get; set; }
}
