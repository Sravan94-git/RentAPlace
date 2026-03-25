using Microsoft.EntityFrameworkCore;
using RentAPlace.API.Models;

namespace RentAPlace.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Property>()
            .Property(x => x.Price)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Property>()
            .Property(x => x.Rating)
            .HasColumnType("decimal(4,2)");

        modelBuilder.Entity<Booking>()
            .Property(x => x.TotalPrice)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Booking>()
            .HasOne(x => x.Property)
            .WithMany(x => x.Bookings)
            .HasForeignKey(x => x.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Booking>()
            .HasOne(x => x.Renter)
            .WithMany(x => x.Bookings)
            .HasForeignKey(x => x.RenterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(x => x.Property)
            .WithMany(x => x.Messages)
            .HasForeignKey(x => x.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.SentMessages)
            .HasForeignKey(x => x.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(x => x.Receiver)
            .WithMany(x => x.ReceivedMessages)
            .HasForeignKey(x => x.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(x => x.Property)
            .WithMany(x => x.Reviews)
            .HasForeignKey(x => x.PropertyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(x => x.Reviewer)
            .WithMany(x => x.GivenReviews)
            .HasForeignKey(x => x.ReviewerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
