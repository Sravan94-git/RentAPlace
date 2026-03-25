using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentAPlace.API.Data;
using RentAPlace.API.DTOs;
using RentAPlace.API.Models;
using System.Security.Claims;

namespace RentAPlace.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("property/{propertyId}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews(int propertyId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Reviewer)
            .Where(r => r.PropertyId == propertyId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                PropertyId = r.PropertyId,
                ReviewerId = r.ReviewerId,
                ReviewerName = r.Reviewer!.FullName,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ReviewDto>> CreateReview(ReviewCreateDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out var userId)) return Unauthorized(new { message = "Unauthorized" });

        var property = await _context.Properties.FindAsync(dto.PropertyId);
        if (property == null) return NotFound(new { message = "Property not found" });

        if (dto.Rating < 1 || dto.Rating > 5) return BadRequest(new { message = "Rating must be between 1 and 5." });

        var review = new Review
        {
            PropertyId = dto.PropertyId,
            ReviewerId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
        
        var allRatings = await _context.Reviews
            .Where(r => r.PropertyId == property.Id)
            .Select(r => r.Rating)
            .ToListAsync();
            
        property.ReviewsCount = allRatings.Count;
        property.Rating = allRatings.Any() ? (decimal)allRatings.Average() : 0m;

        await _context.SaveChangesAsync();

        var reviewer = await _context.Users.FindAsync(userId);

        return Ok(new ReviewDto
        {
            Id = review.Id,
            PropertyId = review.PropertyId,
            ReviewerId = review.ReviewerId,
            ReviewerName = reviewer?.FullName ?? "Unknown",
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        });
    }
}
