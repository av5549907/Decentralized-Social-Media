App={
    loading:false,
    ipfs: window.IpfsApi('ipfs.infura.io', 5001,{ protocol: 'https'}),
    contracts:{},
    load: async()=>{
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.checkUser();
        await App.render();
    }, 

    loadWeb3: async () => {

      if (window.ethereum) {
        console.log("Metamask Detected");
        window.web3 = new Web3(window.ethereum);
        try {
        $("#msg").text("Please connect your metamask")  
        var res = await ethereum.enable();
        App.network=await web3.eth.net.getNetworkType();
        console.log(App.network);
        } catch (error) {
        $("#generalMsgModal").modal("show");
        $("#generalModalMessage").text("Permission Denied, Metamask Not connected!");
        }
      }

      else {
          console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
          $("#generalMsgModal").modal("show");
          $("#generalModalMessage").html("Non-Ethereum browser detected. You should consider trying MetaMask! <br> <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>Download Here</a>");
      }
    },

    loadAccount: async () => {
    App.account = await web3.givenProvider.selectedAddress;
    },
    loadContract: async () => {

    },
    checkUser: async ()=>{

        let isMaintainer=await App.contracts.dwitter.methods.isMaintainer(App.account).call({from:App.account});
        console.log(isMaintainer);
        if(!isMaintainer){
          App.setLoading(true);
          $("#generalMsgModal").modal("show");
          $("#generalModalMessage").text("You are not a Maintainer or Owner, Access Denied!");
        }
  
      } , 
      render: async () => {
          // Prevent double render
          if (App.loading) {
            return;
          }
      
          // Update app loading state
          App.setLoading(true);
      
          // Render Tasks
          await App.renderData();
      
          // Update loading state
          App.setLoading(false);
      },
  
      renderData:async()=>{
        let totalDweets=await App.contracts.dwitter.methods.totalDweets().call({from:App.account});
        let totalUsers=await App.contracts.dwitter.methods.totalUsers().call({from:App.account});
        $("#totalUsers").text(totalUsers);
        $("#totalDweets").text(totalDweets);
        await App.renderReports();
        await App.renderAdvertisements();
      },
      renderReports:async()=>{
        try{
          let ReportsList=await App.contracts.dwitter.methods.getReportedDweets().call({from:App.account});
          $("#totalReports").text(ReportsList.length);
          for(var i=0;i<ReportsList.length;i++){
            let status=await App.contracts.dwitter.methods.getReportedDweetStatus(ReportsList[i]).call({from:App.account});
            if(status==0){
              let html=`<tr><td> `+ReportsList[i]+`</td>
           <td><button type="button" class="btn-warning viewdweet" id="`+ReportsList[i]+`">View</button></td>
           <td>
              <button type="button" class="btn-success ban" id="`+ReportsList[i]+`">Ban</button>
              <button type="button" class="btn-danger free" id="`+ReportsList[i]+`">Free</button>
           </td></tr>`;
              $("#reportsTbody").prepend(html);
            }else if(status==1){
              let html=`<tr><td> `+ReportsList[i]+`</td>
              <td><button type="button" class="btn-warning viewdweet" id="`+ReportsList[i]+`">View</button></td>
              <td>
                 Banned
              </td></tr>`;
                 $("#reportsTbody").append(html);
            }
            else{
              let html=`<tr><td> `+ReportsList[i]+`</td>
              <td><button type="button" class="btn-warning viewdweet" id="`+ReportsList[i]+`">View</button></td>
              <td>
                 Free
              </td></tr>`;
                 $("#reportsTbody").append(html);
            }
          }
        }catch(e){
          $("#generalMsgModal").modal("show");
          $("#generalModalMessage").text("Error! You are not a user of this Platform! Please Register to Continue");
          App.setLoading(true);
          // App.load();
        }
  
        $(".ban").on("click",async (e)=>{
          let dweetId=e.currentTarget.id;
          await App.contracts.dwitter.methods.takeAction(dweetId,true).send({from:App.account});
        });
    
        $(".free").on("click",async (e)=>{
          let dweetId=e.currentTarget.id;
          await App.contracts.dwitter.methods.takeAction(dweetId,false).send({from:App.account});
        });
    
        
        $(".viewdweet").on("click",async (e)=>{
          let dweetId=e.currentTarget.id;
          console.log(dweetId);
          let dweet=await App.contracts.dwitter.methods.getDweet(dweetId).call({from:App.account});
          $("#reportedDweetModal").modal("show");
          $("#dweetTag").text(dweet.hashtag);
          $("#dweetImage").attr("src","https://ipfs.io/ipfs/" + dweet.imgHash);
          $("#dweetContent").text(dweet.content);
        });
      
  
      },
  
      renderAdvertisements:async()=>{
        let advertisementsList=await App.contracts.dwitter.methods.getAds().call({from:App.account});
        $("#totalAdvertisements").text(advertisementsList.length);
        try{
        for(var i=0;i<advertisementsList.length;i++){
          let status=await App.contracts.dwitter.methods.getAdvertisementStatus(advertisementsList[i]).call({from:App.account});
          if(status==0){
            let html=`<tr><td> `+advertisementsList[i]+`</td>
         <td><button type="button" class="btn-warning viewad" id="`+advertisementsList[i]+`">View</button></td>
         <td>
            <button type="button" class="btn-success accept" id="`+advertisementsList[i]+`">Accept</button>
            <button type="button" class="btn-danger reject" id="`+advertisementsList[i]+`">Reject</button>
         </td></tr>`;
            $("#advertisementsTbody").prepend(html);
          }else if(status==1){
            let html=`<tr><td> `+advertisementsList[i]+`</td>
            <td><button type="button" class="btn-warning viewad" id="`+advertisementsList[i]+`">View</button></td>
            <td>
              Accepted
            </td></tr>`;
               $("#advertisementsTbody").append(html);
          }
          else{
            let html=`<tr><td> `+advertisementsList[i]+`</td>
            <td><button type="button" class="btn-warning viewad" id="`+advertisementsList[i]+`">View</button></td>
            <td>
               Rejected
            </td></tr>`;
               $("#advertisementsTbody").append(html);
          }
        }
  
        }catch(e){
          $("#generalMsgModal").modal("show");
          $("#generalModalMessage").text("Error! You are not a user of this Platform! Please Register to Continue");
          App.setLoading(true);
          // App.load();
        }
  
        $(".accept").on("click",async (e)=>{
          let adId=e.currentTarget.id;
          await App.contracts.dwitter.methods.advertisementApproval(adId,true).send({from:App.account});
        });
  
        $(".reject").on("click",async (e)=>{
          let adId=e.currentTarget.id;
          await App.contracts.dwitter.methods.advertisementApproval(adId,false).send({from:App.account});
        });
  
        $(".viewad").on("click",async (e)=>{
          let adId=e.currentTarget.id;
          console.log(adId);
          let ad=await App.contracts.dwitter.methods.getAd(adId).call({from:App.account});
          $("#advertisementModal").modal("show");
          $("#adLink").text(ad.link);
          $("#adImage").attr("src","https://ipfs.io/ipfs/" + ad.imgHash);
        });
  
      },
      setLoading: (boolean) => {
          App.loading = boolean;
          const loader = $("#loader");
          const content = $("#content");
          if (boolean) {
            loader.show();
            // content.hide();
          } else {
            loader.hide();
            // content.show();
          }
    },
  
    showError:async(msg)=>{
      $("#generalMsgModal").modal("show");
      $("#generalModalMessage").text(msg);
    },
  
    maintainerSettings:async()=>{
      let owner=await App.contracts.dwitter.methods.owner().call({from:App.account});
      if(App.account.toLowerCase()==owner.toLowerCase()){
        $("#maintainerModal").modal("show");
        $("#addMaintainerBtn").on("click",async()=>{
          let address=$("#maintainerAddress").val();
          await  App.contracts.dwitter.methods.addMaintainer(address).send({from:App.account});
          $("#MaintainerModalMsg").text("Success, Maintainer Added Successfully")
        });
  
        $("#removeMaintainerBtn").on("click",async()=>{
          let address=$("#maintainerAddress").val();
          await  App.contracts.dwitter.methods.revokeMaintainer(address).send({from:App.account});
          $("#MaintainerModalMsg").text("Success, Maintainer Removed Successfully")
        });
        
      }else{
        $("#generalMsgModal").modal("show");
        $("#generalModalMessage").text("Access Denied!!! You are not Owner of this Platform");
      }
    },
  
    withdrawContractFunds:async()=>{
      let owner=await App.contracts.dwitter.methods.owner().call({from:App.account});
      console.log(owner);
      console.log(App.account);
      if(App.account.toLowerCase()==owner.toLowerCase()){
        $("#contractBalanceModal").modal("show");
        let balance=await App.contracts.dwitter.methods.getBalance().call({from:App.account});
        $("#contractBalance").text(balance);
    
        $("#WithdrawContractBalance").on("click", async()=>{
           let amount=$("#fundsWithdrawAmount").val();
           await App.contracts.dwitter.methods.transferContractBalance(amount).send({from:App.account});
          let balance=await App.contracts.dwitter.methods.getBalance().call({from:App.account});
          $("#contractBalance").text(balance);
        });
        
      }else{
        $("#generalMsgModal").modal("show");
        $("#generalModalMessage").text("Access Denied!!! You are not Owner of this Platform");
      }
    }
  
   
  
   
  
  
  };
  
  $(() => {
    $(window).on("load",() => {
      App.load();
      $("#fundsBtn").on("click",App.withdrawContractFunds);
      $("#maintainerBtn").on("click",App.maintainerSettings);
  
    });
  });