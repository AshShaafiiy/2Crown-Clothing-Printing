const fs = require('fs');
let code = fs.readFileSync('src/views/admin/Orders.tsx', 'utf8');

if (!code.includes("import { normalizeOrderHistoryDate }")) {
  code = code.replace("import { getValidNextStatuses } from '../../utils/orderTransitions';", "import { getValidNextStatuses } from '../../utils/orderTransitions';\nimport { normalizeOrderHistoryDate } from '../../utils/orderHistory';");
}

const target = `                                  <div className="space-y-3 pl-2">
                                    {order.history.map((entry, i) => (
                                      <div key={i} className="flex text-sm border-l-2 border-gray-200 pl-4 py-1 relative">
                                        <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-[5px] top-2"></div>
                                        <div className="w-32 text-gray-500 shrink-0 text-xs mt-0.5">
                                          {new Date(entry.timestamp).toLocaleString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-800">{entry.newStatus}</div>
                                          <div className="text-xs text-gray-500">{entry.actorName}</div>
                                          {entry.note && <div className="text-xs text-gray-500 mt-1 italic">{entry.note}</div>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>`;

const replacement = `                                  <div className="space-y-3 pl-2">
                                    {order.history.map((entry, i) => {
                                      const normalizedISO = normalizeOrderHistoryDate(entry.timestamp);
                                      const displayDate = normalizedISO 
                                        ? new Date(normalizedISO).toLocaleString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})
                                        : 'Date unavailable';
                                      
                                      // Handle legacy format ({ status, comment }) and canonical format ({ newStatus, note })
                                      // Some legacy formats had string payload instead of object (from the backend bug), handle that too if it's somehow a string
                                      let statusLabel = 'Unknown Status';
                                      let note = '';
                                      let actor = 'System';
                                      
                                      if (typeof entry === 'string') {
                                        // Catch the backend bug where 'Admin updated status' was pushed as a string
                                        statusLabel = 'Status Updated';
                                        note = entry;
                                      } else {
                                        statusLabel = entry.newStatus || (entry as any).status || 'Unknown Status';
                                        note = entry.note || (entry as any).comment || '';
                                        actor = entry.actorName || 'System';
                                      }

                                      return (
                                        <div key={i} className="flex text-sm border-l-2 border-gray-200 pl-4 py-1 relative">
                                          <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-[5px] top-2"></div>
                                          <div className="w-32 text-gray-500 shrink-0 text-xs mt-0.5">
                                            {displayDate}
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-800">{statusLabel}</div>
                                            <div className="text-xs text-gray-500">{actor}</div>
                                            {note && <div className="text-xs text-gray-500 mt-1 italic">{note}</div>}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/views/admin/Orders.tsx', code);
