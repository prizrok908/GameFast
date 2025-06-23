using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentAndDeliveryMethodsToPurchase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeliveryAddress",
                table: "Purchases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryMethod",
                table: "Purchases",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PaymentMethod",
                table: "Purchases",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PickupPoint",
                table: "Purchases",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryAddress",
                table: "Purchases");

            migrationBuilder.DropColumn(
                name: "DeliveryMethod",
                table: "Purchases");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Purchases");

            migrationBuilder.DropColumn(
                name: "PickupPoint",
                table: "Purchases");
        }
    }
}
