# Storage component API


1. Upload method: 
    * generate new key or use existing
    * encrypt and authenticate collection of blobs with encryption method specified in CryptoObject
    * generate blob urls
    * upload collection of blobs
    * write key/blob url to blob objects (and crypto object if new key was generated)
    * throw specified exception (TODO: specify exceptions)

    upload (collection of StorageBlob blobCollection, CryptoObject crypto) throws ...exception
    
5. Download method:
    * download collection of blobs (identified by blob urls)
    * authenticate and decrypt this collection
    * write blob data to blob objects
    * throw specified exception (TODO: specify exceptions)
    
    download (collection of StorageBlob blobCollection, CryptoObject crypto) throws ...exception
    
7. Delete method:
    * delete a collection of blobs from specified urls
    
## Objects

    class CryptoObject {

      private enum EncryptionMethod;
      private ... Keys;
      
      public CryptoObject (enum EncryptionMethod); //for new key generation
      public CryptoObject (enum EncryptionMethod, ... Keys); //for importing key
       
    } // not part of storage class but crypto class
    

    class StorageBlob {

      private byte[BLOB_SIZE] blobData;
      private string blobUrl;
      
      public byte[] getBlobData();
      public string getBlobUrl();
      
      
      public StorageBlob (byte[] blobData);
      public StorageBlob (string blobUrl);
    }

    

   