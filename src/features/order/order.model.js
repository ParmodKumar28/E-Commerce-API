export default class OrderModel{

    constructor(userId,totalAmount,timestamp)
    {
        this.userID = userId;
        this.totalAmount = totalAmount;
        this.timestamp = timestamp;
    }
}