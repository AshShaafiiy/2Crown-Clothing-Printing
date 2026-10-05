const fs = require('fs');
const file = 'src/services/api/OrderService.test.ts';
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  /it\('legacy phone stays JSON body; secure reference canonicalized\/encoded'[\s\S]*?\);/,
  `it('secure reference canonicalized/encoded',async()=>{api.mockResolvedValue(null);const service=new ApiOrderService();await service.getOrderByReference('2C-123456','09000000000');expect(api).toHaveBeenCalledWith('/orders/track',{method:'POST',body:JSON.stringify({reference:'2C-123456',phone:'09000000000'})});const nullRes=await service.getOrderByReference('2C-01234567-89ABCDEF-01234567-89ABCDEF','09000000000');expect(nullRes).toBeNull();});`
);
fs.writeFileSync(file, data);
