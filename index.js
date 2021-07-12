async function query(knex) {
    await knex.raw(`create schema if not exists permissions`);
    await knex.raw(`
        create table if not exists permissions.resource_shares(
            id varchar(100) not null,
            user_id varchar(100),
            group_id varchar(100),
            resource_name varchar(100) not null,
            permission varchar(100) not null,
            resource_id varchar(100) not null
        );      
    `);

    await knex.raw(`
        INSERT INTO permissions.resource_shares(id, user_id, group_id, resource_name, permission, resource_id)
        VALUES
            ('2c8ae58d-7d5a-47f4-b8c2-ee61154a46bd', '3c7c772e-bb92-414e-8c83-44f50fbf43ec', null, 'TestResource', 'CREATOR', '2e18b802-da72-42ac-834c-128b82e8d9d2'),
            ('22da9208-817b-4509-be59-a96ce41637c8', null, '19695c32-8493-47a2-8ae3-0ac87867e8b7', 'TestResource', 'READ', '2e18b802-da72-42ac-834c-128b82e8d9d2');    
    `);

    return knex.raw(`
        select * 
        from permissions.resource_shares 
        where 
            resource_name = 'TestResource' and 
            permission in ('CREATOR', 'DELETE', 'UPDATE', 'READ') and 
            (group_id in ('19695c32-8493-47a2-8ae3-0ac87867e8b7') or user_id = 'huehue')    
    `)
}

const memoryDb = require('pg-mem').newDb();
const knexPgMem = memoryDb.adapters.createKnex();
const knexLocalhost = require('knex')({
   client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'somePassword',
        database : 'test'
    }
});

query(knexPgMem).then(result => {
    console.info(result);
});

query(knexLocalhost).then(result => {
    console.info(result);
});
