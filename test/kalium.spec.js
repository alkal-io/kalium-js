const rewire = require("rewire");
const expect = require('chai').expect;
const sinon = require("sinon");
const DummyKaliumAdapater = require('./utils/kalium-dummy-adapter');
const Kalium = rewire('../lib/kalium');
const DummyQueue = require('./utils/dummy-queue');
const log = Kalium.__get__('log');

describe("kalium", function () {

    describe("end-2-end tests", () => {
        const dummyQueue = new DummyQueue();
        const dummyKaliumAdapter1 = new DummyKaliumAdapater(dummyQueue);
        const dummyKaliumAdapter2 = new DummyKaliumAdapater(dummyQueue);
        const kalium1 = new Kalium(dummyKaliumAdapter1);
        const kalium2 = new Kalium(dummyKaliumAdapter2);


        it('should react to payment object upon posting a payment object', function (done) {
            var payment = {id: "abcde", processed: false};
            kalium2.on("Payment", function (recievedPayment) {
                expect(recievedPayment.id).to.equal(payment.id);
                done();
            });
            kalium1.start();
            kalium2.start();
            kalium1.post("Payment", payment);
        });
    });

    describe("Method level tests", () => {

        let stubAdapter;
        let kalium;
        let logSpy = sinon.spy(log);;

        beforeEach(function () {
            let adapterToStub = new DummyKaliumAdapater(new DummyQueue());
            stubAdapter = sinon.stub(adapterToStub);// runs before each test in this block
            kalium = new Kalium(stubAdapter);

        });

        it('should call start on adapter when start() is called', () => {
            kalium.start();
            expect(stubAdapter.start.calledOnce).to.equal(true);
        });

        it('should call stop on adapter when stop() is called', () => {
            kalium.stop();
            expect(stubAdapter.stop.calledOnce).to.equal(true);
        });


        it('should log an error when posting undefined object', () => {
            kalium.post("Payment",undefined);
            expect(logSpy.error.calledWith("Object is null or undefined. No object will be posted!")).to.equal(true);
        });

        it('should log an error when posting undefined object type', () => {
            kalium.post(undefined,{abc:"cde"});
            expect(logSpy.error.calledWith("ObjectType is null or undefined. No object will be posted!")).to.equal(true);
        });
    });


});