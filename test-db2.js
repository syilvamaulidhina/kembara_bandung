require('dotenv').config();
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kembara_bandung' });
pool.query('SELECT * FROM "Review" LIMIT 1').then(res => {
  if(res.rows.length > 0) {
    const rev = res.rows[0];
    console.log('Valid Review:', rev);
    fetch(`http://localhost:3000/api/pengunjung/reviews/${rev.id}/helpful`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', userId: rev.userId })
    }).then(r => r.json()).then(json => {
      console.log('PATCH Response:', json);
      pool.end();
    });
  } else {
    console.log('No reviews');
    pool.end();
  }
}).catch(e => {
  console.error(e);
  pool.end();
});
