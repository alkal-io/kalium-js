const expect = require('chai').expect;
const DummyKaliumAdapater = require('./utils/kalium-dummy-adapter');
const Kalium =  require('../lib/kalium');
const DummyQueue = require('./utils/dummy-queue');


describe("kalium",function () {
    const dummyQueue = new DummyQueue();
    const dummyKaliumAdapter1 = new DummyKaliumAdapater(dummyQueue);
    const dummyKaliumAdapter2 = new DummyKaliumAdapater(dummyQueue);
    const kalium1 = new Kalium(dummyKaliumAdapter1);
    const kalium2 = new Kalium(dummyKaliumAdapter2);

    it('should react to payment object upon posting a payment object', function  (done) {
        var payment = {id:"abcde", processed: false};
        kalium2.on("Payment", function (recievedPayment) {
            expect(recievedPayment.id).to.equal(payment.id);
            done();
        });
        kalium1.start();
        kalium2.start();
        kalium1.post("Payment", payment);
    });
});