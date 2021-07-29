// async getWikiArticles(places, props) {
//     var emptyShit = []
//     this.setState({ wikiPages: emptyShit })
//     var url = ''
//     for (let place of places) {
//       url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + place.placeName + "%22" + place.placeName + "%22&format=json&srlimit=3&origin=*"
//       await fetch(url)
//         .then(res => {
//           return res.json()
//         })
//         .then(res => {
//           // If there is no results with specific searches, return three general searches. (Can be disabled by just deleting this)
//           if (res.query.search.length == 0) {
//             url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + place.placeName + "&format=json&srlimit=3&origin=*"
//             fetch(url)
//               .then(newres => {
//                 return newres.json()
//               })
//               .then(newres => {
//                 var object = [
//                   {
//                     coordinate: place.coordinate,
//                     placeName: place.placeName,
//                     articles: newres.query.search
//                   }
//                 ]
//                 this.state.wikiPages.push(object);
//               })
//               .catch(error => {
//                 console.log(error)
//               })
//           }
//           else {
//             var object = [
//               {
//                 coordinate: place.coordinate,
//                 placeName: place.placeName,
//                 articles: res.query.search
//               }
//             ]
//             this.state.wikiPages.push(object);
//           }
//         })
//         .catch(error => {
//           console.log(error)
//         })
//     }
//     this.getTheLinks(props)
//   }