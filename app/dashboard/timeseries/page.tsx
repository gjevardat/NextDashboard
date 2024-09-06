import { getTS } from '@/app/lib/data';


export default async function Page() {
  const data = await getTS();

  
  return (
    <div>
      <h1>Data from getTS</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <p><strong>Source ID:</strong> {item.sourceid}</p>
             {/* Format observation times */}
            <p>
              <strong>Observation Times:</strong> 
              {item.obstimes
                .map((time) => time.toFixed(4)) // Format each time to 2 decimal places
                .join(', ')} {/* Join the times with a comma and space */}
            </p>
            <p><strong>Value:</strong> {item.val}</p>
            <p><strong>Value Error:</strong> {item.valerr}</p>
            <p><strong>Transit ID:</strong> {item.transitid}</p>
          </li>
        ))}
      </ul>
    </div>





  );
}
