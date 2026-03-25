using System.ComponentModel.DataAnnotations;

namespace RentAPlace.API.DTOs;

public class PropertyCreateDto
{
    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = "";

    [Required]
    [MaxLength(120)]
    public string Location { get; set; } = "";

    [Required]
    [MaxLength(40)]
    public string PropertyType { get; set; } = "Apartment";

    [Range(1, 1000000)]
    public decimal Price { get; set; }

    [Range(1, 30)]
    public int MaxGuests { get; set; } = 2;

    [MaxLength(2000)]
    public string Description { get; set; } = "";

    public string ImageUrl { get; set; } = "";
    public bool HasPool { get; set; }
    public bool IsBeachFacing { get; set; }
    public bool HasGarden { get; set; }
}

public class PropertyQueryDto
{
    public string? Location { get; set; }
    public string? PropertyType { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? HasPool { get; set; }
    public bool? IsBeachFacing { get; set; }
    public bool? HasGarden { get; set; }
    public int? Guests { get; set; }
    public string? SortBy { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 9;
}

public class PropertyResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Location { get; set; } = "";
    public string PropertyType { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public bool HasPool { get; set; }
    public bool IsBeachFacing { get; set; }
    public bool HasGarden { get; set; }
    public int MaxGuests { get; set; }
    public decimal Rating { get; set; }
    public int ReviewsCount { get; set; }
    public int OwnerId { get; set; }
}
