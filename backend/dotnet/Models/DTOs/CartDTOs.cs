using System;
using System.Collections.Generic;

namespace Backend.Models.DTOs;

/// <summary>
/// DTO pour les items du panier
/// </summary>
public class CartItemDto
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Image { get; set; }
    public int Quantity { get; set; } = 1;
    public DateTime AddedAt { get; set; }
}

/// <summary>
/// DTO pour la réponse du panier complet
/// </summary>
public class CartResponseDto
{
    public List<CartItemDto> Items { get; set; } = new();
    public int ItemsCount { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public string Currency { get; set; } = "XAF";
    public DateTime UpdatedAt { get; set; }
}
