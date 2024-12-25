const SubscriptionForm = () => {
  return (
    <div>
      <h1>Subscription Form</h1>
      <p>Subscribe to our newsletter</p>
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}
export default SubscriptionForm;