const express = require("express");
const bodyParser = require('body-parser');
const axios = require('axios')
const router = express.Router();
module.exports = router;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.get('/:usuario', async function(req, res){
    if(!req.params.usuario)
      res.json({status: 'error'});
      
      try {
        let userData = (await axios.get(`https://www.instagram.com/${req.params.usuario}/?__a=1`)).data
        let json = {};
        json.id = userData.graphql.user.id;
        json.full_name = userData.graphql.user.full_name;
        json.username = userData.graphql.user.username;
        json.seguidores = userData.graphql.user.edge_followed_by;
        json.seguindo = userData.graphql.user.edge_follow;
        json.biografia = userData.graphql.user.biography;
        json.perfil_privado = userData.graphql.user.is_private;
        json.tipo_negocio = userData.graphql.user.business_category_name;
        json.url_externo = userData.graphql.user.external_url;
        json.fotoPerfil = userData.graphql.user.profile_pic_url_hd;
        json.paginaFacebook = userData.graphql.user.connected_fb_page;
        json.publicacoes = {}
        json.publicacoes.count = userData.graphql.user.edge_owner_to_timeline_media.count;
        var lista = [];
    
        for (var i = 0; i < userData.graphql.user.edge_owner_to_timeline_media.edges.length; i++) {
          var itemLista = {};
          itemLista._id = userData.graphql.user.edge_owner_to_timeline_media.edges[i].node.id;
          itemLista.likes = userData.graphql.user.edge_owner_to_timeline_media.edges[i].node.edge_liked_by;
          itemLista.thumbnail = userData.graphql.user.edge_owner_to_timeline_media.edges[i].node.thumbnail_src;
          itemLista.shortcode = userData.graphql.user.edge_owner_to_timeline_media.edges[i].node.shortcode;
          itemLista.text = userData.graphql.user.edge_owner_to_timeline_media.edges[i].node.edge_media_to_caption.edges[0].node.text;
          itemLista.linkPost = `https://www.instagram.com/p/${itemLista.shortcode}`;
          lista.push(itemLista);
        }
        json.publicacoes.lista = lista;
        res.json(json);
      } catch (error) {
        res.json({status:"error"})
        console.log(error)
      }
})


router.get('/status', function(req, res){
  res.json({status:"OK"})
});
