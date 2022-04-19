# How-To: Content Catalog Search App

Code samples and data collection for the MongoDB Dev Hub article.

## Set up

* Clone repo
* Create free Atlas cluster

## Import data

```
mongorestore mongodb+srv://blog:blog@cluster0.2grje.mongodb.net/mdbstore ~/Downloads/dump/mongoshop/products.bson
```

## Create indexes

## Generate an aggregation pipeline

```
[
  {
    '$search': {
      'text': {
        'query': 'phone', 
        'path': 'name'
      },
      highlight: { 
          path: "name" 
      }
    }
  }, {
    '$project': {
      '_id': 0, 
      'name': 1, 
      'main_description': 1, 
      'main_image_url': 1, 
      'price': 1, 
      'brand': 1
    }
  }, {
    '$limit': 10
  }
]
```

## Edit Backend

Add connection string to `.env`
Add aggregation pipeline to `index.js`
