import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import List "mo:core/List";

actor {
  // Types
  type MenuItem = {
    name : Text;
    description : Text;
    category : Text;
    priceCents : Nat;
    isPopular : Bool;
  };

  type Review = {
    reviewerName : Text;
    rating : Nat8;
    content : Text;
    date : Time.Time;
  };

  type Photo = {
    title : Text;
    category : Text;
    url : Text;
  };

  type CafeInfo = {
    hours : Text;
    contact : Text;
    address : Text;
  };

  // Modules for comparison/sorting
  module MenuItem {
    public func compare(item1 : MenuItem, item2 : MenuItem) : Order.Order {
      Text.compare(item1.name, item2.name);
    };
  };

  module Review {
    public func compareByDate(review1 : Review, review2 : Review) : Order.Order {
      if (review1.date < review2.date) { #less } else if (review1.date > review2.date) {
        #greater;
      } else { #equal };
    };
  };

  module Photo {
    public func compareByTitle(photo1 : Photo, photo2 : Photo) : Order.Order {
      Text.compare(photo1.title, photo2.title);
    };
  };

  // Persistent storage
  let menuItems = Map.empty<Text, MenuItem>();
  let reviews = List.empty<Review>();
  let photos = Map.empty<Text, Photo>();
  var cafeInfo : CafeInfo = {
    hours = "Mon-Fri: 7am-4pm, Sat-Sun: 8am-5pm";
    contact = "+1 123 456 7890";
    address = "123 Brick Lane, Melbourne";
  };
  var admin : ?Principal = null;

  // Admin management
  public shared ({ caller }) func initializeAdmin() : async () {
    if (admin != null) { Runtime.trap("Admin is already set") };
    admin := ?caller;
  };

  // Menu item management
  public shared ({ caller }) func addMenuItem(name : Text, description : Text, category : Text, priceCents : Nat, isPopular : Bool) : async () {
    checkAdmin(caller);
    let menuItem : MenuItem = {
      name;
      description;
      category;
      priceCents;
      isPopular;
    };
    menuItems.add(name, menuItem);
  };

  public shared ({ caller }) func updateMenuItem(name : Text, description : Text, category : Text, priceCents : Nat, isPopular : Bool) : async () {
    checkAdmin(caller);
    let menuItem : MenuItem = {
      name;
      description;
      category;
      priceCents;
      isPopular;
    };
    menuItems.add(name, menuItem);
  };

  public shared ({ caller }) func deleteMenuItem(name : Text) : async () {
    checkAdmin(caller);
    menuItems.remove(name);
  };

  // Review management
  public shared ({ caller }) func addReview(reviewerName : Text, rating : Nat8, content : Text) : async () {
    let review : Review = {
      reviewerName;
      rating;
      content;
      date = Time.now();
    };
    reviews.add(review);
  };

  public shared ({ caller }) func deleteReview(date : Time.Time) : async () {
    checkAdmin(caller);
    let filteredReviews = reviews.filter(
      func(review) {
        review.date != date;
      }
    );
    reviews.clear();
    reviews.addAll(filteredReviews.values());
  };

  // Photo management
  public shared ({ caller }) func addPhoto(title : Text, category : Text, url : Text) : async () {
    checkAdmin(caller);
    let photo : Photo = {
      title;
      category;
      url;
    };
    photos.add(title, photo);
  };

  public shared ({ caller }) func deletePhoto(title : Text) : async () {
    checkAdmin(caller);
    photos.remove(title);
  };

  // Cafe info management
  public shared ({ caller }) func updateCafeInfo(hours : Text, contact : Text, address : Text) : async () {
    checkAdmin(caller);
    cafeInfo := {
      hours;
      contact;
      address;
    };
  };

  // Public queries
  public query ({ caller }) func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray().sort();
  };

  public query ({ caller }) func getReviews() : async [Review] {
    reviews.toArray().sort(Review.compareByDate);
  };

  public query ({ caller }) func getPhotos() : async [Photo] {
    photos.values().toArray().sort(Photo.compareByTitle);
  };

  public query ({ caller }) func getCafeInfo() : async CafeInfo {
    cafeInfo;
  };

  func checkAdmin(caller : Principal) {
    switch (admin) {
      case (?adminPrincipal) {
        if (caller != adminPrincipal) { Runtime.trap("Only admin can perform this operation") };
      };
      case (null) { Runtime.trap("Admin not initialized") };
    };
  };
};
