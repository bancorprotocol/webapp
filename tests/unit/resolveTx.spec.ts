//yarn test:unit -i resolveTx.spec.ts

describe("resolveTx", () => {  
  
  test("check get proper event when resolveTx", async () => {
    let txHash: string = 'txHash';
    const onHash = jest.fn()
    const onConfirmation = jest.fn()
    const onError = jest.fn()
    const mockSendTx = jest.fn()
      .mockImplementationOnce(cb => cb(null, onHash))
      .mockImplementationOnce(cb => cb(null, onConfirmation))
      .mockImplementationOnce(cb => cb('err', onError))

    const promise = new Promise((resolve, reject) => {
      mockSendTx((err: any, cbHash: any) => {
        cbHash()
        resolve(txHash)
      })
      mockSendTx((err: any, cbConfirmation: any) => {
        cbConfirmation()        
      })
      mockSendTx((err: any, cbError: any) => {
        reject(err)
      })
    });

    const response = await promise;
    expect(response).toBe(txHash);
    expect(mockSendTx).toHaveBeenCalled();
    expect(onHash).toHaveBeenCalled();
    expect(onConfirmation).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(mockSendTx.mock.calls.length).toBe(3);
  })
})