const mysql = require('mysql')

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_management',
})

// View Users

exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)

    connection.query(
      'SELECT * FROM user WHERE status = "active"',
      (err, rows) => {
        // When done with the connection, release it
        let removedUser = req.query.removed
        if (err) throw err
        res.render('home', { rows, removedUser })
      }
    )
  })
}

// Find User by search

exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)

    let { search } = req.body

    connection.query(
      'SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?',
      ['%' + search + '%', '%' + search + '%'],
      (err, rows) => {
        // When done with the connection, release it

        if (err) throw err
        res.render('home', { rows })
      }
    )
  })
}

exports.form = (req, res) => {
  res.render('adduser')
}

exports.create = (req, res) => {
  let { first_name, last_name, email, phone, comments } = req.body

  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)

    connection.query(
      'INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        // When done with the connection, release it

        if (err) throw err
        res.render('adduser', { alert: 'User added successfully' })
      }
    )
  })
}

// Edit User

exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)

    connection.query(
      'SELECT * FROM user WHERE id = ?',
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it

        if (err) throw err
        res.render('edituser', { rows })
      }
    )
  })
}

exports.update = (req, res) => {
  let { first_name, last_name, email, phone, comments } = req.body
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)

    connection.query(
      'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        // When done with the connection, release it

        if (err) throw err
        connection.query(
          'SELECT * FROM user WHERE id = ?',
          [req.params.id],
          (err, newRows) => {
            // When done with the connection, release it
            console.log(newRows)
            if (err) throw err
            res.render('edituser', {
              rows: newRows,
              alert: `${first_name} was updated succefully`,
            })
          }
        )
      }
    )
  })
}

exports.delete = (req, res) => {
  /*   pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)
    console.log(req.params.id)
    connection.query(
      'DELETE FROM user WHERE id = ?',
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it

        if (err) throw err
        res.redirect('/')
      }
    )
  }) */

  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)

    connection.query(
      'UPDATE user set status = ? WHERE id = ?',
      ['removed', req.params.id],
      (err, rows) => {
        // When done with the connection, release it

        if (err) throw err
        let removedUser = encodeURIComponent('User successfully removed.')
        res.redirect('/?removed=' + removedUser)
      }
    )
  })
}

exports.viewAll = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('Connect as ID ' + connection.threadId)

    connection.query(
      'SELECT * FROM user WHERE id = ?',
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it

        if (err) throw err
        res.render('viewuser', { rows })
      }
    )
  })
}
