using RentAPlace.API.DTOs;
using RentAPlace.API.Models;

namespace RentAPlace.API.Services;

public static class MappingExtensions
{
    public static PropertyResponseDto ToDto(this Property property)
    {
        return new PropertyResponseDto
        {
            Id = property.Id,
            Title = property.Title,
            Location = property.Location,
            PropertyType = property.PropertyType,
            Price = property.Price,
            Description = property.Description,
            ImageUrl = property.ImageUrl,
            HasPool = property.HasPool,
            IsBeachFacing = property.IsBeachFacing,
            HasGarden = property.HasGarden,
            MaxGuests = property.MaxGuests,
            Rating = property.Rating,
            ReviewsCount = property.ReviewsCount,
            OwnerId = property.OwnerId
        };
    }

    public static BookingResponseDto ToDto(this Booking booking)
    {
        return new BookingResponseDto
        {
            Id = booking.Id,
            PropertyId = booking.PropertyId,
            PropertyTitle = booking.Property?.Title ?? "",
            PropertyImageUrl = booking.Property?.ImageUrl ?? "",
            Location = booking.Property?.Location ?? "",
            RenterId = booking.RenterId,
            RenterName = booking.Renter?.FullName ?? "",
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            Guests = booking.Guests,
            TotalPrice = booking.TotalPrice,
            Status = booking.Status,
            CreatedAt = booking.CreatedAt
        };
    }

    public static MessageResponseDto ToDto(this Message message)
    {
        return new MessageResponseDto
        {
            Id = message.Id,
            PropertyId = message.PropertyId,
            PropertyTitle = message.Property?.Title ?? "",
            SenderId = message.SenderId,
            SenderName = message.Sender?.FullName ?? "",
            ReceiverId = message.ReceiverId,
            ReceiverName = message.Receiver?.FullName ?? "",
            Content = message.Content,
            IsRead = message.IsRead,
            CreatedAt = message.CreatedAt
        };
    }
}
