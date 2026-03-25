using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentAPlace.API.Data;
using RentAPlace.API.DTOs;
using System.Security.Claims;

namespace RentAPlace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Owner")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnalyticsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("owner/dashboard")]
    public async Task<ActionResult<OwnerDashboardMetricsDto>> GetOwnerDashboard()
    {
        var ownerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(ownerIdStr, out var ownerId)) return Unauthorized();

        var totalProperties = await _context.Properties.CountAsync(p => p.OwnerId == ownerId);
        var totalBookings = await _context.Bookings.CountAsync(b => b.Property.OwnerId == ownerId);
        
        var totalRevenue = await _context.Bookings
            .Where(b => b.Property.OwnerId == ownerId && b.Status != "Cancelled")
            .SumAsync(b => b.TotalPrice);

        var properties = await _context.Properties
            .Where(p => p.OwnerId == ownerId)
            .ToListAsync();
            
        var averageRating = properties.Any() ? properties.Average(p => p.Rating) : 0m;

        var recentBookings = await _context.Bookings
            .Include(b => b.Property)
            .Include(b => b.Renter)
            .Where(b => b.Property.OwnerId == ownerId)
            .OrderByDescending(b => b.CreatedAt)
            .Take(8)
            .Select(b => new BookingAlertDto
            {
                BookingId = b.Id,
                PropertyTitle = b.Property!.Title,
                RenterName = b.Renter!.FullName,
                CreatedAt = b.CreatedAt,
                TotalPrice = b.TotalPrice
            })
            .ToListAsync();

        return Ok(new OwnerDashboardMetricsDto
        {
            TotalProperties = totalProperties,
            TotalBookings = totalBookings,
            TotalRevenue = totalRevenue,
            AverageRating = (decimal)averageRating,
            RecentBookings = recentBookings
        });
    }
}
