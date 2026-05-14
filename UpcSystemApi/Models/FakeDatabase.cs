namespace UpcSystemApi.Models
{
    public class FakeDatabase
    {
        public static List<User> Users = new List<User>()
    {
        new User { Id = 1, Email = "admin@test.com", Password = "123", Role = "owner" },
        new User { Id = 2, Email = "user@test.com", Password = "123", Role = "user" }
    };

    }
}
