using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models.Entities;
using Backend.Models.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly ILogger<CartController> _logger;

    public CartController(ICartService cartService, ILogger<CartController> logger)
    {
        _cartService = cartService;
        _logger = logger;
    }
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        try
        {
            var userId = 1; // À remplacer par l'ID utilisateur connecté
            var items = await _cartService.GetUserCartAsync(userId);
            
            // Convertir en DTO avec la structure complète du panier
            var cartDto = new CartResponseDto
            {
                Items = items.Select(item => new CartItemDto
                {
                    Id = item.Id,
                    SubjectId = item.SubjectId,
                    Title = item.Subject?.Title ?? "",
                    Description = item.Subject?.Description,
                    Price = item.Price,
                    Image = item.Subject?.ThumbnailUrl,
                    Quantity = 1,
                    AddedAt = item.AddedAt
                }).ToList(),
                ItemsCount = items.Count(),
                Subtotal = items.Sum(i => i.Price),
                Discount = 0,
                Tax = items.Sum(i => i.Price) * 0.1m,
                Total = items.Sum(i => i.Price) * 1.1m,
                Currency = "XAF",
                UpdatedAt = DateTime.UtcNow
            };
            
            return Ok(cartDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération du panier");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] CartItem item)
    {
        try
        {
            var userId = 1; // À remplacer par l'ID utilisateur connecté
            var added = await _cartService.AddToCartAsync(userId, item.SubjectId, item.Price);
            return Ok(added);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'ajout au panier");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpDelete("remove/{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        try
        {
            var userId = 1; // À remplacer par l'ID utilisateur connecté
            var result = await _cartService.RemoveFromCartAsync(userId, id);
            if (!result)
                return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression du panier");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpPost("clear")]
    public async Task<IActionResult> ClearCart()
    {
        try
        {
            var userId = 1; // À remplacer par l'ID utilisateur connecté
            var result = await _cartService.ClearCartAsync(userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors du vidage du panier");
            return StatusCode(500, "Erreur serveur");
        }
    }
}
